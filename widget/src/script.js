;(() => {
  let createElement = tag => document.createElement(tag)

  let selectTypeStatus = 't'

  let style = createElement('style')
  style.innerHTML = `{{{css}}}`
  document.head.appendChild(style)

  let registerWidget = (parent, trigger, isSticky) => {
    let container = createElement('div')
    container.innerHTML = `{{{widgetHtml}}}`
    parent.appendChild(container)

    let widget = container.firstElementChild
    let widgetQuerySelector = selector => widget.querySelector(selector)
    /** @type {HTMLFormElement} */
    let form = widgetQuerySelector('form')
    /** @type {HTMLTextAreaElement} */
    let textarea = widgetQuerySelector('textarea')
    /** @type {HTMLButtonElement} */
    let submitBtn = widgetQuerySelector('[type=submit]')
    /** @type {HTMLHeadingElement} */
    let heading = widgetQuerySelector('h1')
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
      widget.setAttribute('s', state)
    }

    let reposition = () => {
      let getRect = e => e.getBoundingClientRect()
      let widgetRect = getRect(widget)
      let top = 16
      let left = 16

      let triggerRect = getRect(trigger)

      let positionBelow = triggerRect.top + triggerRect.height + 16
      let positionAbove = triggerRect.top - widgetRect.height - 16

      if (positionAbove >= 0) {
        top = positionAbove
      } else if (positionBelow + widgetRect.height < window.innerHeight) {
        top = positionBelow
      }

      let triggerCenter = triggerRect.left + triggerRect.width / 2
      let positionCentered = triggerCenter - widgetRect.width / 2

      left = Math.min(Math.max(16, positionCentered), window.innerWidth)

      widget.style.top = `${top}px`
      widget.style.left = `${left}px`
    }

    let showWidget = () => {
      widget.style.display = 'block'
      widget.focus()
      reposition()
      window.addEventListener('scroll', reposition)
      window.addEventListener('resize', reposition)
    }

    let hideWidget = () => {
      if (isSticky) {
        setState(selectTypeStatus)
      } else {
        widget.style.display = 'none'
        trigger.focus()
        window.removeEventListener('scroll', reposition)
        window.removeEventListener('resize', reposition)
      }
    }

    let triggerHandler = () => {
      if (widget.style.display === 'block') {
        hideWidget()
      } else {
        showWidget()
      }
    }

    trigger.addEventListener('click', triggerHandler)

    form.onsubmit = async e => {
      e.preventDefault()
      submitBtn.setAttribute('loading', true)
      textarea.disabled = true
      submitBtn.disabled = true
      let data = Object.fromEntries(new FormData(form))
      data.text = textarea.value
      try {
        await fetch(`${window._AQRM_BASE_URL}/api/feedback`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        })
      } finally {
        submitBtn.removeAttribute('loading')
        textarea.disabled = false
        form.reset()
        setState('s')
      }
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

      let type = btn.getAttribute('aria-label')

      textarea.placeholder = {
        issue: 'I noticed that...',
        idea: 'I would love...',
        other: 'What do you want to know about us?',
      }[type]

      heading.innerText = {
        issue: 'Report an Issue',
        idea: 'Share an Idea',
        other: 'Tell us anything!',
      }[type]

      typeInput.value = type.toUpperCase()

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
