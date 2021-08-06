const CenteredCardLayout: React.FC = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="w-full max-w-lg px-4 py-12 bg-white rounded-lg shadow-lg sm:px-12">
        {children}
      </main>
    </div>
  )
}

export const getLayout: GetLayout = page => <CenteredCardLayout>{page}</CenteredCardLayout>

export default CenteredCardLayout
