/* eslint-disable @typescript-eslint/no-explicit-any */
import { Brand, Client, Place, Product, Proform, Provider, Sale, Shopping } from "./interfaces";

const headers = { 'Content-Type': 'application/json' }

export const getApiProducts = async (search: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/products/?search=${search}`, {  signal, headers })
  const data: Product[] = await response.json()
  return data;
};

export const getApiProduct = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(`/api/products/${id}/`, { signal, headers })
  const data: Product = await response.json()
  return data;
};

export const createApiProduct = async (input: any) => {
  const response = await fetch('/api/products/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Product = await response.json()
  return data;
};

export const updateApiProduct = async (id: number, input: any) => {
  const response = await fetch(`/api/products/${id}/`, { method: 'PUT', body: JSON.stringify(input), headers })
  const data: Product = await response.json()
  return data;
};

export const deleteApiProduct = async (id: number) => {
  const response = await fetch(`/api/products/${id}/`, { method: 'DELETE', headers })
  const data: Product = await response.json()
  return data;
};


// places section
export const getApiPlaces = async (search: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/places/?search=${search}`, { signal , headers })
  const data: Place[] = await response.json()
  return data;
};

export const getApiPlace = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(`/api/places/${id}`, { signal , headers })
  const data: Place = await response.json()
  return data;
};

export const createApiPlace = async (input: any) => {
  const response = await fetch('/api/places/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Place = await response.json()
  return data;
};

export const updateApiPlace = async (id: number, input: any) => {
  const response = await fetch(`/api/places/${id}/`, { method: 'PUT', body: JSON.stringify(input), headers })
  const data: Place = await response.json()
  return data;
};

export const deleteApiPlace = async (id: number) => {
  const response = await fetch(`/api/places/${id}/`, { method: 'DELETE', headers })
  const data: Place = await response.json()
  return data;
};


// providers section
export const getApiProviders = async (search: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/providers/?search=${search}`, { signal , headers })
  const data: Provider[] = await response.json()
  return data;
};

export const getApiProvider = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(`/api/providers/${id}/`, { signal , headers })
  const data: Provider = await response.json()
  return data;
};

export const createApiProvide = async (input: any) => {
  const response = await fetch('/api/providers/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Provider = await response.json()
  return data;
};

export const updateApiProvider = async (id: number, input: any) => {
  const response = await fetch(`/api/providers/${id}/`, { method: 'PUT', body: JSON.stringify(input), headers })
  const data: Provider = await response.json()
  return data;
};

export const deleteApiProvider = async (id: number) => {
  const response = await fetch(`/api/providers/${id}/`, { method: 'DELETE', headers })
  const data: Provider = await response.json()
  return data;
};

// brands section
export const getApiBrands = async (search: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/brands/?search=${search}`, { signal , headers })
  const data: Brand[] = await response.json()
  return data;
};

export const getApiBrand = async (id: number, signal?: AbortSignal) => {
  const response = await fetch(`/api/brands/${id}/`, { signal , headers })
  const data: Brand = await response.json()
  return data;
};

export const createApiBrand = async (input: any) => {
  const response = await fetch('/api/brands/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Brand = await response.json()
  return data;
};

export const updateApiBrand = async (id: number, input: any) => {
  const response = await fetch(`/api/brands/${id}/`, { method: 'PUT', body: JSON.stringify(input), headers })
  const data: Brand = await response.json()
  return data;
};

export const deleteApiBrand = async (id: number) => {
  const response = await fetch(`/api/brands/${id}/`, { method: 'DELETE', headers })
  const data: Brand = await response.json()
  return data;
};


// shopping section
export const getApiShopping = async (params: { begin: string; end: string; }, signal?: AbortSignal) => {
  const response = await fetch(`/api/shopping?begin=${params.begin}&end=${params.end}`, { signal,  headers })
  const data: Shopping[] = await response.json()
  return data;
};

export const createApiShopping = async (input: any) => {
  const response = await fetch('/api/shopping/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Shopping[] = await response.json()
  return data;
};

export const getApiSales = async (params: { begin: string; end: string; }, signal?: AbortSignal) => {
  const response = await fetch('/api/sales?' + new URLSearchParams(params).toString(), { signal, headers })
  const data: Sale[] = await response.json()
  return data;
};

export const createApiSale = async (input: any) => {
  const response = await fetch('/api/sales/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Sale = await response.json()
  return data;
};

type ClientResponse = { success: true; data: Client } | { success: false; error: { status: number; text: string } };

export const getClientByNit = async (nit: string): Promise<ClientResponse> => {
  const response = await fetch(`/api/clients/${nit}/`, { headers })
  if (!response.ok) {
    return { success: false, error: { status: response.status, text: response.statusText } }
  }
  const data: Client = await response.json()
  return { success: true, data };
};


export const createApiProform = async (input: any) => {
  const response = await fetch('/api/proform/', { method: 'POST', body: JSON.stringify(input), headers })
  const data: Proform = await response.json()
  return data;
};


export const getApiProform = async (proform_id: string, signal?: AbortSignal) => {
  const response = await fetch(`/api/proform/${proform_id}/`, { signal , headers })
  const data: Proform[] = await response.json()
  return data;
};