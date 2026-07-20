import { API_URL } from './constants'

const BASE_URL = `${(API_URL || '').replace(/\/$/, '')}/api/v1`

export class ApiError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }
}

function normalizeMessage (raw) {
  if (Array.isArray(raw)) return raw.join(', ')
  return raw || 'Unknown error'
}

export async function apiFetch (path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers['Authorization'] = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    })
  } catch (err) {
    throw new ApiError(0, 'Network error')
  }

  let data
  try {
    const text = await response.text()
    data = text ? JSON.parse(text) : {}
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new ApiError(response.status, normalizeMessage(data.message))
  }

  return data
}
