'use client';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

export default function ScrollArea({ children }: { children: React.ReactNode }) {
  return (
    <SimpleBar 
      className="flex-1"
      style={{ 
        maxHeight: '100%',
        height: '100%'
      }}
      autoHide={false}  // 始终显示滚动条
    >
      {children}
    </SimpleBar>
  );
} 