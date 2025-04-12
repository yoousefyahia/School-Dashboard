'use client';

import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import ChatComponent from '@/components/ChatComponent'  // تأكد من أنك أضفت الكود الخاص بالشات في هذا الملف

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const router = useRouter();

  // التأكد من حالة المستخدم عند تحميل الصفحة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  
  // تسجيل الدخول أو الخروج
  const handleLogin = async () => {
    if (user) {
      await signOut(auth);
      setUser(null);
      console.log("Logged out");
      alert("تم تسجيل الخروج بنجاح.");
    } else {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Logged in as:", user?.displayName);
      setUser(user);
      router.push("/admin");
    }
  };

  // فتح الشات عند الضغط على الأيقونة
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <div className='flex items-center justify-between p-4'>
      {/* Icons + User Info */}
      <div className='flex items-center gap-6 justify-end w-full'>
        
        {/* Message Icon - عند الضغط عليها تفتح الشات */}
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer' onClick={toggleChat}>
          <Image src="/message.png" alt="Message Icon" width={20} height={20}/>
        </div>

        {/* Notification Icon */}
        <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
          <Image src="/announcement.png" alt="Notification Icon" width={20} height={20}/>
          <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
        </div>

        {/* User Info - يظهر عند تسجيل الدخول */}
        {user && (
          <div className='flex flex-col'>
            <span className="text-xs leading-3 font-medium">{user.displayName}</span>
            <span className="text-[10px] text-gray-500 text-right">User</span>
          </div>
        )}

        {/* Login / Logout */}
        <div className="cursor-pointer flex items-center gap-1" onClick={handleLogin}>
          <Image src={user?.photoURL || "/avatar.png"} alt="User Avatar" width={36} height={36} className="rounded-full"/>
          <span className="text-xs">
            {user ? "❌ sign out" : "👤 sign in"}
          </span>
        </div>
      </div>

      {/* عرض الشات عند الضغط على أيقونة الرسائل */}
      {showChat && <ChatComponent />}
    </div>
  );
};

export default Navbar;
