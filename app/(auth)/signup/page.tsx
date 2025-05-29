import React from 'react';
import SignUp from '@/components/Auth/SignUp';

const Page = () => {
  return (
    <div>
      <SignUp redirectTo='/dashboard'/>
    </div>
  );
}

export default Page;
