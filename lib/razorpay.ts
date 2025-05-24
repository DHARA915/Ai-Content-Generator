export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      resolve(true);
    };
    
    script.onerror = () => {
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Type declaration for Razorpay
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}