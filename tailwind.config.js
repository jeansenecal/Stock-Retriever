/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.{html,js,ejs,hbs}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
