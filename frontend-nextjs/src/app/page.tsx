export default function Home() {
  return (
    <main className="flex flex-col items-center h-screen space-y-6">
      <div className="flex flex-col h-11/12 w-11/12 border-solid border-2">
        <h1>Accounts</h1>
      </div>
      <div className="flex flex-col gap-6 h-11/12 w-11/12 border-solid border-2">
        <h1>Operations</h1>
      </div>
      <div className="flex flex-col gap-6 h-11/12 w-11/12 border-solid border-2">
        <h1>Graph</h1>
      </div>
    </main>
  )
}
