import Translator from '../src/Translator';
import { expect, test } from "vitest";

import translations from './Mocks/translations.json'

const TranslatorJs = Translator.factory(translations)

test('hello', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Hello')
  ).toBe('Hallo')
})

test('simple number >1', async () => {
  TranslatorJs.setLocale('es')
  expect(
    TranslatorJs.trans_choice('There is one apple|There are many apples', 5)
  ).toBe('Hay muchas manzanas')
})
