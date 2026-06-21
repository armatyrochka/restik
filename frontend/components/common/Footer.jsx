export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Restaurant Manager</h3>
              <p className="text-gray-400">
                Смачна їжа з доставкою додому. 
                Готуємо з любов'ю з найкращих інгредієнтів.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакти</h4>
              <div className="space-y-2 text-gray-400">
                <p> +380 (99) 999-99-99</p>
                <p> info@restaurant.com</p>
                <p> м. Київ, вул. Ресторанна, 1</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Графік роботи</h4>
              <div className="space-y-2 text-gray-400">
                <p>Пн-Пт: 10:00 - 22:00</p>
                <p>Сб-Нд: 11:00 - 23:00</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>© 2026 Restaurant Manager. Всі права захищено.</p>
          </div>
        </div>
      </footer>
    );
  }