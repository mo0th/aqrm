export const getFormFields = <Data extends Record<string, any> = Record<string, any>>(
  form: HTMLFormElement
): Data => {
  return Object.fromEntries(new FormData(form) as any) as Data
}
