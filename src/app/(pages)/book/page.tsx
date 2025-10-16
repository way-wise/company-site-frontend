"use client";

export default function BookPage() {
  return (
    <div className="min-h-[70vh] bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className=" mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <iframe
              allowFullScreen
              allow="clipboard-write"
              scrolling="no"
              className="fp-iframe w-full h-full"
              style={{ height: "600px" }}
              src="https://heyzine.com/flip-book/6bd9f721d9.html"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
