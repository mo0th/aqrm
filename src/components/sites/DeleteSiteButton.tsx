import { useDeleteSite } from '@/lib/sites.client'
import { Dialog } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../ui/Button'

interface DeleteSiteButtonProps {
  siteName: string
}

const DeleteSiteButton: React.FC<DeleteSiteButtonProps> = ({ siteName }) => {
  const [showModal, setShowModal] = useState(false)
  const deleteSite = useDeleteSite(siteName)
  const router = useRouter()

  const handleClose = () => {
    setShowModal(false)
  }

  const handleDelete = async () => {
    await deleteSite.mutateAsync()
    router.push('/dashboard')
  }

  return (
    <>
      <Button variant="delete" onClick={() => setShowModal(true)}>
        Delete {siteName}
      </Button>

      <Dialog
        open={showModal}
        onClose={handleClose}
        className="fixed inset-0 flex items-center justify-center"
      >
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="relative w-full max-w-lg p-8 space-y-6 bg-white shadow-xl rounded-2xl">
          <Dialog.Title className="text-4xl font-bold">Delete {siteName}</Dialog.Title>
          <Dialog.Description>
            Are you sure you want to delete this site? This is <b>irreverisble</b> and will{' '}
            <b>delete</b> any feedback for this site. Consider exporting feedback data before
            deleting.
          </Dialog.Description>

          <div className="flex justify-end space-x-6">
            <Button
              variant="muted"
              type="button"
              disabled={deleteSite.isLoading}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="delete"
              type="submit"
              loading={deleteSite.isLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteSiteButton
