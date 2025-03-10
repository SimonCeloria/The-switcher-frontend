import postcssConfig from "../../postcss.config";

describe('PostCSS Configuration', () => {
  it('should have the correct plugins configured', () => {
    expect(postcssConfig.plugins).toHaveProperty('tailwindcss');
    expect(postcssConfig.plugins).toHaveProperty('autoprefixer');
  });
});
