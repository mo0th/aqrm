;(() => {
  /**
   * @returns {HTMLElement}
   */
  let createElement = tag => document.createElement(tag)
  let getRect = e => e.getBoundingClientRect()

  let selectTypeStatus = 't'

  let style = createElement('style')
  style.innerHTML = '{{{css}}}'
  document.head.append(style)

  let registerWidget = (parent, trigger, isSticky) => {
    let container = createElement('div')
    container.innerHTML = '{{{widgetHtml}}}'
    parent.append(container)

    let widget = container.firstChild
    let widgetQuerySelector = selector => widget.querySelector(selector)
    /** @type {HTMLFormElement} */
    let form = widgetQuerySelector('form')
    /** @type {HTMLTextAreaElement} */
    let textarea = widgetQuerySelector('textarea')
    /** @type {HTMLButtonElement} */
    let submitBtn = widgetQuerySelector('#aqrm-submit')
    /** @type {HTMLHeadingElement} */
    let heading = widgetQuerySelector('.aqrm-heading')
    /** @type {HTMLInputElement} */
    let typeInput = widgetQuerySelector('[name=type]')

    widgetQuerySelector('[name=site]').value = window._AQRM_SITE_NAME
    widgetQuerySelector('[name=userId]').value = trigger.getAttribute('data-aqrm-user-id')

    let setState = state => {
      if (state === selectTypeStatus) heading.innerText = "What's on your mind?"
      if (state === 'i') {
        textarea.value = ''
        submitBtn.disabled = true
      }
      widget.dataset.s = state
    }

    let reposition = () => {
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

    let showWidget = () => {
      widget.hidden = false
      widget.focus()
      reposition()
      window.addEventListener('scroll', reposition)
      window.addEventListener('resize', reposition)
    }

    let hideWidget = () => {
      if (isSticky) {
        setState(selectTypeStatus)
      } else {
        widget.hidden = true
        trigger.focus()
        window.removeEventListener('scroll', reposition)
        window.removeEventListener('resize', reposition)
      }
    }

    let triggerHandler = () => {
      if (widget.hidden) {
        showWidget()
      } else {
        hideWidget()
      }
    }

    trigger.addEventListener('click', triggerHandler)

    form.onsubmit = e => {
      e.preventDefault()
      submitBtn.dataset.l = ''
      textarea.disabled = true
      submitBtn.disabled = true

      fetch(window._AQRM_BASE_URL + '/api/feedback', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      }).finally(_ => {
        delete submitBtn.dataset.l
        textarea.disabled = false
        form.reset()
        setState('s')
      })
    }

    widgetQuerySelector('#aqrm-btn-close').onclick = _ => {
      if (!isSticky) hideWidget()
      setState(selectTypeStatus)
    }

    widgetQuerySelector('#aqrm-btn-back').onclick = _ => {
      setState(selectTypeStatus)
    }

    textarea.oninput = _ => {
      submitBtn.disabled = !textarea.value
    }

    widgetQuerySelector('.aqrm-success button').onclick = _ => setState(selectTypeStatus)

    widgetQuerySelector('.aqrm-select-type').onclick = e => {
      let btn = e.target.closest('button')

      if (!btn) return

      let type = btn.dataset.t

      let [placeholder, headingText] = {
        ISSUE: ['I noticed that...', 'Report an Issue'],
        IDEA: ['I would love...', 'Share an Idea'],
        OTHER: ['What do you want to know about us?', 'Tell us anything!'],
      }[type]
      textarea.placeholder = placeholder
      heading.innerText = headingText

      typeInput.value = type

      setState('i')
      textarea.focus()
    }

    if (isSticky) showWidget()

    widget.unregister = () => {
      trigger.removeEventListener('click', triggerHandler)
      container.remove()
    }

    return widget
  }

  let trigger = document.querySelector('[data-aqrm]')
  if (trigger) registerWidget(document.body, trigger)
  window._AQRM_REGISTER = registerWidget
})()
