class AQRMWidget extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    let root = this.attachShadow({ mode: 'closed' })
    root.innerHTML = '{{{widgetHtml}}}<style>{{{css}}}</style>'
    /**
     * @type {HTMLElement}
     */
    let widget = root.firstChild
    let trigger = this.children[0]
    let isSticky = this.hasAttribute('sticky')
    let getRect = e => e.getBoundingClientRect()
    let selectTypeStatus = 't'
    /** @type {<T>(selectors: T) => ReturnType<typeof document.querySelector<T>>} */
    let widgetQuerySelector = selector => widget.querySelector(selector)
    /** @type {HTMLFormElement} */
    let form = widgetQuerySelector('form')
    /** @type {HTMLTextAreaElement} */
    let textarea = widgetQuerySelector('textarea')
    /** @type {HTMLButtonElement} */
    let submitBtn = widgetQuerySelector('#submit')
    /** @type {HTMLHeadingElement} */
    let heading = widgetQuerySelector('.heading')
    /** @type {HTMLButtonElement} */
    let typeInput = widgetQuerySelector('[name=type]')

    /**
     * @type {(state: 'i' | 't' | 's') => void}
     */
    let setState = state => {
      if (state === selectTypeStatus) heading.innerText = "What's on your mind?"
      if (state === 'i') {
        textarea.value = ''
        submitBtn.disabled = true
      }
      widget.dataset.s = state
    }

    /**
     * @type {() => void}
     */
    let reposition = _ => {
      let widgetRect = getRect(widget)
      let top = 16

      let triggerRect = getRect(trigger)

      let positionBelow = triggerRect.top + triggerRect.height + 16
      let positionAbove = triggerRect.top - widgetRect.height - 16

      if (positionAbove >= 0) {
        top = positionAbove
      } else if (positionBelow + widgetRect.height < window.innerHeight) {
        top = positionBelow
      }

      let left = Math.min(
        Math.max(16, triggerRect.left + triggerRect.width / 2 - widgetRect.width / 2),
        window.innerWidth
      )

      widget.style.top = top + 'px'
      widget.style.left = left + 'px'
    }

    /**
     * @type {() => void}
     */
    let showWidget = _ => {
      widget.hidden = false
      widget.focus()
      reposition()
      window.addEventListener('scroll', reposition)
      window.addEventListener('resize', reposition)
    }

    /**
     * @type {() => void}
     */
    let hideWidget = _ => {
      if (isSticky) {
        setState(selectTypeStatus)
      } else {
        widget.hidden = true
        trigger.focus()
        window.removeEventListener('scroll', reposition)
        window.removeEventListener('resize', reposition)
      }
    }

    /**
     * @type {() => void}
     */
    let triggerHandler = () => {
      if (widget.hidden) {
        showWidget()
      } else {
        hideWidget()
      }
    }

    trigger.addEventListener('click', triggerHandler)

    let img
    widgetQuerySelector('#pic').onclick = async _ => {
      let stream
      img = navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(s => {
          stream = s
          return new Promise((res, rej) => {
            let v = document.createElement('video')
            v.srcObject = s
            v.play()
            v.onloadeddata = _ => res(v)
            v.onerror = rej
          })
        })
        .then(v => {
          return new Promise((res, rej) => {
            setTimeout(() => {
              let c = document.createElement('canvas')
              c.width = v.videoWidth
              c.height = v.videoHeight
              c.getContext('2d').drawImage(v, 0, 0)
              c.toBlob(
                b => (b ? res(b) : rej(b)),
                ['safari', 'ersion'].every(s => navigator.userAgent.includes(s))
                  ? 'image/jpeg'
                  : 'image/webp'
              )
            }, 150)
          })
        })
        .finally(_ => {
          stream?.getVideoTracks().forEach(t => t.stop())
        })
      // document.body.appendChild(v)
      // const image = document.createElement('img')
      // image.src = URL.createObjectURL(await img)
      // document.body.appendChild(image)
    }

    form.onsubmit = async e => {
      e.preventDefault()

      let body = new FormData(form)
      body.set('site', this.getAttribute('site'))
      let uid = this.getAttribute('user-id')
      if (uid) {
        body.set('userId', uid)
      }

      submitBtn.dataset.l = ''
      textarea.disabled = true
      submitBtn.disabled = true

      if (img) {
        console.log('img', img)
        img = await img.catch(_ => '')
        console.log('img', img)
        body.set('img', img)
      }

      console.log(Object.fromEntries(body))

      // this is defined globally per-script
      // eslint-disable-next-line no-undef
      fetch(_AQRM_BASE_URL + '/api/feedback', {
        method: 'POST',
        body,
      }).finally(_ => {
        delete submitBtn.dataset.l
        textarea.disabled = false
        form.reset()
        setState('s')
      })
    }

    widgetQuerySelector('#btn-close').onclick = _ => {
      if (!isSticky) hideWidget()
      setState(selectTypeStatus)
    }

    widgetQuerySelector('#btn-back').onclick = _ => {
      setState(selectTypeStatus)
    }

    textarea.oninput = _ => {
      submitBtn.disabled = !textarea.value
    }

    widgetQuerySelector('.success .btn-s').onclick = _ => setState(selectTypeStatus)

    widgetQuerySelector('.select-type').onclick = e => {
      let btn = e.target.closest('button')

      if (!btn) return

      let type = btn.dataset.t

      let [placeholder, headingText] = {
        // ISSUE
        S: ['I noticed that...', 'Report an issue'],
        // IDEA
        D: ['I would love...', 'Share an idea'],
        // OTHER
        T: ['What do you want to know about us?', 'Tell us anything!'],
      }[type[1]]
      textarea.placeholder = placeholder
      heading.innerText = headingText

      typeInput.value = type

      setState('i')
      textarea.focus()
    }

    if (isSticky) showWidget()
  }
}
customElements.define('aqrm-widget', AQRMWidget)
