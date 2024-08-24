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

test('hello', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Hello')
  ).toBe('Hallo')
})
test('replace 1', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Welcome, :name', {name: 'Norman'})
  ).toBe('Willkommen Norman')
})

test('replace ucfirst', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Good morning :name', {name: 'norman'})
  ).toBe('Guten Morgen Norman')
})

test('replace uppercase', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Good evening :name', {name: 'norman'})
  ).toBe('Guten Abend NORMAN')
})

test('replace multiple', async () => {
  TranslatorJs.setLocale('de')
  expect(
    TranslatorJs.trans('Hello :name and good day :name. Have fun, :name.', {name: 'norman'})
  ).toBe('Hallo norman und schönen Tag Norman, Viel Spaße NORMAN.')
})
