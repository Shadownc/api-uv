import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollArea from "@/components/ScrollArea";

export default function MainLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col h-screen">
        <Header className="flex-none" />
        <ScrollArea>
          <main>
            {children}
          </main>
        </ScrollArea>
        <Footer className="flex-none" />
      </div>
    );
  }