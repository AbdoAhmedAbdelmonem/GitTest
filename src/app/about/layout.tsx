export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ fontFamily: 'Rubik, sans-serif' }}>
      {children}
    </div>
  );
}
