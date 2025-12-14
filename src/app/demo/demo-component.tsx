"use client";

export function DemoComponent({
  success,
  imageURL,
}: {
  success: boolean;
  imageURL: string;
}) {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold tracking-tighter">
        Demo Page for Sist.
      </h1>
      <div className="my-4">
        {success && (
          <img
            src={imageURL || ""}
            alt="Generated"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
