'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const navigation = [
    { name: '首页', href: '/' },
    { name: '接口监控', href: '/monitor' },
    { name: '更新日志', href: '/changelog' },
    { name: '接口文档', href: '/docs' },
  ];

  const handleSignIn = () => {
    signIn(undefined, { callbackUrl: '/admin' });
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">API平台</span>
            </Link>
            <div className="ml-10 hidden space-x-8 md:flex">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === link.href
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <span className="text-gray-500">加载中...</span>
            ) : session ? (
              <>
                <span className="text-gray-600">
                  {session.user?.name || session.user?.email}
                </span>
                {session.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    管理后台
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  退出登录
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="text-gray-500 hover:text-gray-700"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 