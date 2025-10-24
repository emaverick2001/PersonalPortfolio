export const PageHeader: React.FC<{ children: React.ReactNode; id?: string }> = ({
  children,
  id,
}) => {
  return (
    <section
      id={id}
      className="my-6 flex flex-col items-center justify-around gap-6 text-center sm:flex-row sm:gap-4 sm:text-left"
    >
      <div className="container">
        <h1 className="text-4xl font-bold tracking-tight">{children}</h1>
      </div>
    </section>
  )
}
