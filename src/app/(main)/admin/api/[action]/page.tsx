'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ApiFormData {
  name: string;
  description: string;
  endpoint: string;
  method: string;
  returnType: string;
  parameters: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;
  responses: Array<{
    name: string;
    required: boolean;
    description: string;
  }>;
  examples: Array<{
    type: string;
    content: string;
  }>;
}

export default function ApiForm({ api }: { api?: ApiFormData }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ApiFormData>(api || {
    name: '',
    description: '',
    endpoint: '',
    method: 'GET',
    returnType: 'JSON',
    parameters: [],
    responses: [],
    examples: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/api', {
        method: api ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error saving API:', error);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {api ? '编辑 API' : '新增 API'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">API名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows={3}
              />
            </div>

            {/* 其他表单字段... */}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 