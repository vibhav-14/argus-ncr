'use client';

export default function OuroborosLogo() {
  return (
    <div className="flex items-center justify-center w-full py-4">
      <img
        src="/ouroboros.webp"
        alt="Ouroboros"
        className="w-12 h-12 object-contain"
        style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))' }}
      />
    </div>
  );
}
