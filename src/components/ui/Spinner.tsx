interface SpinnerProps {}

const Spinner: React.FC<SpinnerProps> = () => {
  return (
    <span
      aria-hidden
      className="inline-block h-[1em] w-[1em] rounded-full border-2 animate-spin-fast border-primary-700"
      style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent' }}
    />
  )
}

export default Spinner
