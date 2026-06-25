import type { Metadata } from "next";
import { ClientLayout } from "../components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "멍고 (MungGo) - 반려견 산책 지수 & 펫 프렌들리 동선 메이커",
  description: "반려견 성향에 맞춘 개인화 산책 지수와 펫 프렌들리 산책 동선을 확인하고, 산책 일기를 남겨보세요.",
  icons: {
    icon: "/icon.svg",
  },
};

/**
 * 루트 레이아웃 컴포넌트
 * @param props 자식 노드
 * @returns 구글 폰트가 적용된 HTML 구조
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F5]">
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            background: '#FAF9F5',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '450px',
              height: '100vh',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              background: '#F4EEE2',
            }}
          >
            <ClientLayout>{children}</ClientLayout>
          </div>
        </div>
      </body>
    </html>
  );
}
