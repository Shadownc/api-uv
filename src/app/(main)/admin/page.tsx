import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API 管理</h1>
      </div>
      
      {/* 管理页面内容 */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p>管理页面内容</p>
      </div>
    </div>
  );
} 