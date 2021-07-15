;(() => {
  let style = document.createElement('style')
  style.innerHTML = `{{{css}}}`
  document.head.appendChild(style)

  let trigger = document.querySelector('[data-aqrm]')

  let registerWidget = (parent, trigger, isSticky) => {
    let container = document.createElement('div')
    container.innerHTML = `{{{widgetHtml}}}`
    parent.appendChild(container)

    let widget = container.firstElementChild
    let form = widget.querySelector('form')
    let textarea = widget.querySelector('textarea')
    let submitBtn = widget.querySelector('[type=submit]')
    let heading = widget.querySelector('h1')
    let typeInput = widget.querySelector('[name=type]')
    let siteInput = widget.querySelector('[name=site]')
    let userInput = widget.querySelector('[name=userId]')

    siteInput.value = window._AQRM_SITE_NAME
    userInput.value = trigger.getAttribute('data-aqrm-user-id')

    let setState = state => {
      if (state === 'select-type') heading.innerText = "What's on your mind?"
      if (state === 'input') {
        textarea.value = ''
        submitBtn.disabled = true
      }
      widget.setAttribute('state', state)
    }

    let reposition = () => {
      let widgetRect = widget.getBoundingClientRect()
      let top = 16
      let left = 16

      let triggerRect = trigger.getBoundingClientRect()

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
        setState('select-type')
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

    form.addEventListener('submit', async e => {
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
        setState('success')
      }
    })

    widget.querySelector('#aqrm-btn-close').addEventListener('click', () => {
      if (!isSticky) hideWidget()
      setState('select-type')
    })

    widget.querySelector('#aqrm-btn-back').addEventListener('click', () => {
      setState('select-type')
    })

    textarea.addEventListener('input', () => {
      submitBtn.disabled = !textarea.value
    })

    widget.querySelector('.aqrm-success button').addEventListener('click', () => {
      setState('select-type')
    })

    widget.querySelector('.aqrm-select-type').addEventListener('click', e => {
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

      setState('input')
      textarea.focus()
    })

    if (isSticky) showWidget()

    widget.unregister = () => {
      trigger.removeEventListener('click', triggerHandler)
      container.remove()
    }

    return widget
  }

  if (trigger) registerWidget(document.body, trigger)
  window._AQRM_REGISTER = registerWidget
})()
