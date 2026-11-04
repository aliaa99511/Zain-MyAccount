/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import NumberStep from './NumberStep';
import OTPStep from './OTPStep';

function AddAccount({onAddAccount, onClose}:{onAddAccount: any, onClose: () => void}) {
  const [step, setStep] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(undefined);
  const handleNext = async () => {
    await onAddAccount(phoneNumber).unwrap();

    setStep(prev => prev + 1);
  }
  return (
    <>
      {step == 0 ? <NumberStep setPhoneNumber={setPhoneNumber} onSuccess={handleNext} onClose={onClose} />:undefined}
      {step == 1 ? <OTPStep phoneNumber={phoneNumber ?? ""} />:undefined}
    </>
  )
}

export default AddAccount