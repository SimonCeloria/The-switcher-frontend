import tailwindConfig from "../../tailwind.config";

describe('Tailwind CSS Configuration', () => {
  it('should have the correct content paths', () => {
    const expectedContentPaths = [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ];
    
    expect(tailwindConfig.content).toEqual(expectedContentPaths);
  });

  it('should have an empty plugins array', () => {
    expect(tailwindConfig.plugins).toEqual([]);
  });

  it('should have an extend property in theme', () => {
    expect(tailwindConfig.theme).toHaveProperty('extend');
  });
});
