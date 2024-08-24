import Translator from '../src/Translator';
import { expect, test } from "vitest";

import translations from './Mocks/translations.json'

const TranslatorJs = new Translator(
  '',
  '',
  '',
  'en',
  translations,
  false
)

test('simple number 1', async () => {
  TranslatorJs.setLocale('es')
  expect(
    TranslatorJs.trans_choice('There is one apple|There are many apples', 1)
  ).toBe('Hay una manzana')
})

test('simple number >1', async () => {
  TranslatorJs.setLocale('es')
  expect(
    TranslatorJs.trans_choice('There is one apple|There are many apples', 5)
  ).toBe('Hay muchas manzanas')
})

test('0 apples', async () => {
  TranslatorJs.setLocale('en')
  expect(
    TranslatorJs.trans_choice('apples', 0)
  ).toBe('There are none')
})

test('12 apples', async () => {
  TranslatorJs.setLocale('en')
  expect(
    TranslatorJs.trans_choice('apples', 12)
  ).toBe('There are some')
})

test('22 apples', async () => {
  TranslatorJs.setLocale('en')
  expect(
    TranslatorJs.trans_choice('apples', 22)
  ).toBe('There are many')
})

test('1 minute ago', async () => {
  TranslatorJs.setLocale('en')
  expect(
    TranslatorJs.trans_choice('minutes_ago', 1, {value: 1})
  ).toBe('1 minute ago')
})

test('5 minutes ago', async () => {
  TranslatorJs.setLocale('en')
  expect(
    TranslatorJs.trans_choice('minutes_ago', 5, {value: 5})
  ).toBe('5 minutes ago')
})

test('1 with no translation', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans_choice('There is one cat|There are many cats', 1)
  ).toBe('There is one cat')
})

test('2 with no translation', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans_choice('There is one cat|There are many cats', 2)
  ).toBe('There are many cats')
})
