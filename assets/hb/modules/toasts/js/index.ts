import params from '@params'
import Toast from 'js/bootstrap/src/toast.js'
import { getCookie, deleteCookie } from '@hugomods/cookies'

let container: null | HTMLElement = null

const getContainer = (): HTMLElement => {
  if (container === null) {
    container = document.createElement('div')
    container.className = 'toast-container hb-toast-container position-fixed end-0 bottom-0 mb-3 me-2'
    document.body.appendChild(container)
  }

  return container
}

export interface ToastOptions {
  autoHide?: boolean
  style?: string
}

export const add = (title: string, content: string, options: ToastOptions = {}): void => {
  const container = getContainer()
  const toast = document.createElement('div')
  toast.className = 'toast hb-toast'
  if (options.autoHide === false) {
    toast.setAttribute('data-bs-autohide', 'false')
  }

  const header = document.createElement('div')
  header.classList.add('toast-header')
  header.innerHTML = `<strong class="me-auto">${title}</strong>
<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`

  const body = document.createElement('div')
  body.classList.add('toast-body')
  body.innerHTML = content

  if (options.style !== undefined) {
    header.classList.add(`text-bg-${options.style}`)
    body.classList.add(`bg-${options.style}-subtle`)
  }

  toast.appendChild(header)
  toast.appendChild(body)
  container.append(toast)

  Toast.getOrCreateInstance(toast).show()
}

export const addStyle = (style, title, content, options: ToastOptions = {}): void => {
  add(title, content, { ...options, style })
}

export const addError = (content, options: ToastOptions = {}, title = 'Error'): void => {
  addStyle('danger', title, content, options)
}

export const addInfo = (content, options: ToastOptions = {}, title = 'Info'): void => {
  addStyle('info', title, content, options)
}

export const addSuccess = (content, options: ToastOptions = {}, title = 'Success'): void => {
  addStyle('success', title, content, options)
}

export const addWarning = (content, options: ToastOptions = {}, title = 'Warning'): void => {
  addStyle('warning', title, content, options)
}

export const readToastsFromCookie = (name: string): void => {
  const toastCookie = getCookie(name)
  if (toastCookie !== null) {
    // delete the one time toast cookie.
    deleteCookie(name, { path: '/' })
    const toasts = JSON.parse(atob(decodeURIComponent(toastCookie)))
    for (const toast of toasts) {
      add(toast.title, toast.content, {
        style: toast.style ?? ''
      })
    }
  }
}

(() => {
  readToastsFromCookie(params.toasts.cookie_name)
})()
