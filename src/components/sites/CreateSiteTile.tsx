import { PlusIcon } from '@heroicons/react/24/outline'
import { FormEventHandler, useState } from 'react'
import { Dialog } from '@headlessui/react'

import { useCreateSite } from '~/lib/sites.client'
import InputField from '../ui/InputField'
import Button from '../ui/Button'
import { getFormFields } from '~/lib/forms.client'

const CreateSiteTile: React.FC = () => {
  const [showModal, setShowModal] = useState(false)
  const createSite = useCreateSite()

  const handleClose = () => {
    if (createSite.isPending) return

    setShowModal(false)
    createSite.reset()
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async event => {
    event.preventDefault()

    const body = getFormFields<{ name: string }>(event.currentTarget)

    await createSite.mutateAsync(body)

    handleClose()
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center p-4 space-x-4 text-lg transition bg-gray-200 border-2 border-dashed rounded text-primary-700 border-primary-400 hover:shadow-lg hover:border-primary-600 hover:bg-gray-300"
        disabled={showModal}
      >
        <PlusIcon className="block w-5 h-5" />
        <span>Create new Site</span>
      </button>

      <Dialog
        open={showModal}
        onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg p-8 space-y-6 bg-white shadow-xl rounded-2xl"
        >
          <Dialog.Title className="text-4xl font-bold">Create a new Site</Dialog.Title>
          <InputField
            id="name"
            name="name"
            label="Site Name"
            placeholder="soorria.com"
            error={createSite.error?.issues.name}
            required
          />

          <div className="flex justify-end space-x-6">
            <Button
              variant="muted"
              type="button"
              disabled={createSite.isPending}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={createSite.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CreateSiteTile
