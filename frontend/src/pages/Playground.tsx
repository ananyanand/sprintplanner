import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import Modal from "../components/ui/Modal";
import ContentCard from "../components/ui/ContentCard";

export default function Playground() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-text">
      {/* 🔹 Sidebar */}
      <aside className="w-64 border-r border-primary/10 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold text-primary mb-8">Sprint</h1>

          <nav className="flex flex-col gap-3 text-sm">
            <span className="text-secondary">Dashboard</span>
            <span className="text-secondary">Board</span>
            <span className="text-secondary">Timeline</span>
            <span className="text-primary font-medium">Playground</span>
          </nav>
        </div>

        <p className="text-xs text-secondary">v1.0 UI Kit</p>
      </aside>

      {/* 🔹 Main */}
      <div className="flex flex-col flex-1">
        {/* 🔸 Header */}
        <header className="h-16 px-8 border-b border-primary/10 flex items-center justify-between">
          <h2 className="text-lg font-medium text-primary">UI Preview</h2>

          <div className="flex gap-3">
            <Button variant="outline">Log in</Button>
            <Button>Get started</Button>
          </div>
        </header>

        {/* 🔸 Content */}
        <main className="flex-1 overflow-y-auto px-10 py-8">
          {/* Section: Buttons */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Buttons</h3>

            <div className="flex items-center gap-4 flex-wrap">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          {/* Section: Inputs */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Inputs</h3>

            <div className="flex gap-6 items-center">
              <Input placeholder="Search..." />
              <Input placeholder="Task name..." />
            </div>
          </section>

          {/* Section: Alerts */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Alerts</h3>

            <div className="space-y-2 max-w-md">
              <Alert>Info message</Alert>
              <Alert type="success">Success message</Alert>
              <Alert type="warning">Warning message</Alert>
              <Alert type="error">Error message</Alert>
            </div>
          </section>

          {/* Section: Cards */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Cards</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="h-full">
                <p className="text-secondary text-sm">Total Tasks</p>
                <h2 className="text-2xl text-primary mt-1">24</h2>
              </Card>

              <Card className="h-full">
                <p className="text-secondary text-sm">Completed</p>
                <h2 className="text-2xl text-primary mt-1">18</h2>
              </Card>

              <Card className="h-full">
                <p className="text-secondary text-sm">Pending</p>
                <h2 className="text-2xl text-primary mt-1">6</h2>
              </Card>

              <ContentCard
                title="Sprint Overview"
                description="Track progress, manage tasks and monitor team performance."
                meta="Updated just now"
                action={<Button variant="outline">View</Button>}
              />
            </div>
          </section>

          {/* Section: Table */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Table</h3>

            <Card>
              <Table
                columns={[
                  { header: "Task", accessor: "title" },
                  { header: "Status", accessor: "status" },
                ]}
                data={[
                  { title: "Landing Page", status: "Done" },
                  { title: "API Setup", status: "InProgress" },
                ]}
              />
            </Card>
          </section>

          {/* Section: Loader */}
          <section className="mb-10">
            <h3 className="text-sm text-secondary mb-3">Loader</h3>

            <div className="flex items-center justify-center h-24">
              <Loader />
            </div>
          </section>

          {/* Section: Modal */}
          <section>
            <h3 className="text-sm text-secondary mb-3">Modal</h3>

            <Button onClick={() => setOpen(true)}>Open Modal</Button>

            <Modal isOpen={open} onClose={() => setOpen(false)}>
              <h2 className="text-primary text-lg font-medium mb-2">
                Hello 👋
              </h2>
              <p className="text-secondary">This is your modal preview.</p>
            </Modal>
          </section>
        </main>

        {/* 🔸 Footer */}
        <footer className="h-12 border-t border-primary/10 flex items-center justify-center text-xs text-secondary">
          © 2026 Sprint Planner UI
        </footer>
      </div>
    </div>
  );
}
