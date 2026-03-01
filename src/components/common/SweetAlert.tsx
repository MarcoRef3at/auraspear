import Swal from 'sweetalert2'

export enum SweetAlertIcon {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question',
}

interface ShowOptions {
  title?: string
  text: string
  icon?: SweetAlertIcon
  confirmButtonText?: string
  cancelButtonText?: string
}

interface ShowWithInputOptions {
  title: string
  placeholder?: string
  inputValidator?: (value: string) => string | null
  confirmButtonText?: string
  cancelButtonText?: string
}

interface InputResult {
  confirmed: boolean
  value: string
}

export const SweetAlertDialog = {
  show: async (options: ShowOptions): Promise<boolean> => {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon ?? SweetAlertIcon.QUESTION,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? 'Confirm',
      cancelButtonText: options.cancelButtonText ?? 'Cancel',
      customClass: {
        popup: 'bg-card text-card-foreground border border-border rounded-xl',
        confirmButton: 'bg-primary text-primary-foreground',
      },
    })

    return result.isConfirmed
  },

  showWithInput: async (options: ShowWithInputOptions): Promise<InputResult> => {
    const result = await Swal.fire({
      title: options.title,
      input: 'text',
      inputPlaceholder: options.placeholder ?? '',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? 'Confirm',
      cancelButtonText: options.cancelButtonText ?? 'Cancel',
      inputValidator: value => {
        if (options.inputValidator) {
          return options.inputValidator(value)
        }
        return null
      },
      customClass: {
        popup: 'bg-card text-card-foreground border border-border rounded-xl',
        confirmButton: 'bg-primary text-primary-foreground',
        input: 'bg-background border-input',
      },
    })

    return {
      confirmed: result.isConfirmed,
      value: typeof result.value === 'string' ? result.value : '',
    }
  },
}
