export const AUTOCOMPLETE_MAP = [
  { prefix: "где ", completion: "моя посылка?" },
  { prefix: "как рас", completion: "считать стоимость доставки?" },
  { prefix: "как расс", completion: "читать стоимость доставки?" },
  { prefix: "как рассч", completion: "итать стоимость доставки?" },
  { prefix: "ближ", completion: "айший пункт выдачи СДЭК" },
  { prefix: "как оф", completion: "ормить возврат?" },
  { prefix: "сроки", completion: " доставки между городами" },
  { prefix: "трек", completion: "-номер посылки" },
  { prefix: "отслед", completion: "ить посылку по номеру" },
  { prefix: "стоим", completion: "ость доставки из Москвы" },
  { prefix: "когда", completion: " придёт моя посылка?" },
  { prefix: "можно", completion: " ли изменить адрес доставки?" },
  { prefix: "что дел", completion: "ать, если посылка задерживается?" },
  { prefix: "курьер", completion: "ская доставка до двери" },
  { prefix: "меж", completion: "дународная доставка СДЭК" },
  { prefix: "пункт", completion: " выдачи рядом со мной" },
  { prefix: "возвр", completion: "ат посылки — как оформить?" },
  { prefix: "измен", completion: "ить адрес доставки" },
  { prefix: "связ", completion: "аться с курьером" },
  { prefix: "экспр", completion: "есс-доставка за 1 день" },
  { prefix: "застр", completion: "аховать посылку" },
];

export function getAutocompletion(input) {
  if (!input || input.length < 3) return "";
  const lower = input.toLowerCase();
  for (const item of AUTOCOMPLETE_MAP) {
    if (lower.startsWith(item.prefix) && lower.length <= item.prefix.length + 2) {
      return item.completion.slice(lower.length - item.prefix.length);
    }
  }
  return "";
}
