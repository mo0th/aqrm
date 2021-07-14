;(function () {
  const BASE_URL = window._AQRM_BASE_URL

  const style = document.createElement('style')
  style.innerHTML = `{{{css}}}`
  document.head.appendChild(style)

  const trigger = document.querySelector('[data-aqrm]')

  const registerWidget = (parent, trigger, isSticky) => {
    const container = document.createElement('div')
    container.innerHTML = `{{{widgetHtml}}}`
    parent.appendChild(container)

    const widget = container.querySelector('[data-aqrm-widget]')
    const form = widget.querySelector('form')
    const textarea = widget.querySelector('textarea')
    const submitBtn = widget.querySelector('[type=submit]')
    const heading = widget.querySelector('h1')
    const typeInput = widget.querySelector('input[name=type]')
    const siteInput = widget.querySelector('input[name=site]')
    const userInput = widget.querySelector('input[name=userId]')

    siteInput.value = window._AQRM_SITE_NAME
    userInput.value = trigger.getAttribute('data-aqrm-user-id')

    const setState = state => {
      if (state === 'select-type') heading.innerText = "What's on your mind?"
      widget.setAttribute('state', state)
    }

    const reposition = () => {
      const widgetRect = widget.getBoundingClientRect()
      let top = 16
      let left = 16

      const triggerRect = trigger.getBoundingClientRect()

      const positionBelow = triggerRect.top + triggerRect.height + 16
      const positionAbove = triggerRect.top - widgetRect.height - 16

      if (positionAbove >= 0) {
        top = positionAbove
      } else if (positionBelow + widgetRect.height < window.innerHeight) {
        top = positionBelow
      }

      const triggerCenter = triggerRect.left + triggerRect.width / 2
      const positionCentered = triggerCenter - widgetRect.width / 2

      left = Math.min(Math.max(16, positionCentered), window.innerWidth)

      widget.style.top = `${top}px`
      widget.style.left = `${left}px`
    }

    const showWidget = () => {
      widget.style.display = 'block'
      widget.focus()
      reposition()
      window.addEventListener('scroll', reposition)
      window.addEventListener('resize', reposition)
    }

    const hideWidget = () => {
      if (isSticky) {
        setState('select-type')
      } else {
        widget.style.display = 'none'
        trigger.focus()
        window.removeEventListener('scroll', reposition)
        window.removeEventListener('resize', reposition)
      }
    }

    const triggerHandler = () => {
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
      const data = Object.fromEntries(new FormData(form))
      data.text = textarea.value
      try {
        await fetch(`${BASE_URL}/api/feedback`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (err) {
        console.log(err)
      } finally {
        submitBtn.removeAttribute('loading')
        textarea.disabled = false
        submitBtn.disabled = false
        form.reset()
        setState('success')
      }
    })

    widget.querySelector('#aqrm-btn-close').addEventListener('click', () => {
      if (!isSticky) hideWidget()
      setState('select-type')
    })

    widget.querySelector('#aqrm-btn-back').addEventListener('click', () => {
      heading.innerText = "What's on your mind?"

      submitBtn.disabled = true
      setState('select-type')
    })

    textarea.addEventListener('input', () => {
      submitBtn.disabled = !textarea.value
    })

    widget.querySelector('.aqrm-success button').addEventListener('click', () => {
      setState('select-type')
    })

    widget.querySelector('.aqrm-select-type').addEventListener('click', e => {
      const btn = e.target.closest('button')

      if (!btn) return

      const type = btn.getAttribute('aria-label')

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

      setState(`input-${type}`)
      textarea.focus()
    })

    if (isSticky) showWidget()

    widget.unregister = () => {
      trigger.removeEventListener('click', triggerHandler)
      container.remove()
    }

    return widget
  }

  if (trigger) registerWidget(document.body, trigger, trigger.dataset.aqrm === 'sticky')
  window._AQRM_REGISTER = registerWidget
})()
