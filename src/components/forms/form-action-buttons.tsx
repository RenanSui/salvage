import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react'
import { Button } from '../ui/button'

export type FormState = 'paths' | 'exclusions' | 'overview'

export type ActionButtonsProps = {
  submitText?: string
  setFormState: (value: React.SetStateAction<FormState>) => void
  next: FormState
  prev?: FormState
  isDisabled?: boolean // Optional prop for disabling the button
  isSubmit?: boolean // Optional prop for indicating form submission
  isPathsValid?: boolean
  handleSubmit?: () => unknown
}

export const FormActionButtons = (props: ActionButtonsProps) => {
  const { isDisabled, next, prev, isPathsValid, setFormState, isSubmit, handleSubmit, submitText = 'Create' } = props

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        type="button"
        disabled={isDisabled}
        onClick={() => setFormState(prev || 'paths')}
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <Button
        size="sm"
        type={'button'}
        disabled={!isPathsValid}
        onClick={() => (isSubmit ? handleSubmit?.() : setFormState(next))}
      >
        <span>{isSubmit ? submitText : 'Next'}</span>
        {isSubmit ? <CheckIcon className="ml-1 size-4" /> : <ArrowRightIcon className="ml-1 size-4" />}
      </Button>
    </div>
  )
}
