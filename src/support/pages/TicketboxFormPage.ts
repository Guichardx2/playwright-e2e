import { Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

interface FillOptions {
  firstName?: string;
  lastName?: string;
  email?: string;
  ticketQuantity?: string;
  ticketType?: 'General Admission' | 'VIP';
  hearFrom?: string[];
  requests?: string;
  agree?: boolean;
  signature?: string;
}

export default class TicketboxFormPage {
  constructor(readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('https://ticketbox-backstopjs-tat.s3.eu-central-1.amazonaws.com/index.html');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillFormWithValidData(opts: FillOptions = {}) {
    await this.page.fill('#first-name', opts.firstName ?? faker.person.firstName());
    await this.page.fill('#last-name', opts.lastName ?? faker.person.lastName());
    await this.page.fill('#email', opts.email ?? faker.internet.email());
    await this.page.selectOption('#ticket-quantity', { label: opts.ticketQuantity ?? '2' });

    if ((opts.ticketType ?? 'General Admission') === 'VIP') {
      await this.page.locator('#vip').check();
    } else {
      await this.page.locator('#general').check();
    }

    const hearFrom = opts.hearFrom ?? ['#friend', '#social-media'];
    await this.page.locator('#friend').uncheck();
    await this.page.locator('#publication').uncheck();
    await this.page.locator('#social-media').uncheck();
    for (const selector of hearFrom) {
      await this.page.locator(selector).check();
    }

    await this.page.fill('#requests', opts.requests ?? faker.lorem.sentence());

    if (opts.agree === false) {
      await this.page.locator('#agree').uncheck();
    } else {
      await this.page.locator('#agree').check();
    }

    await this.page.fill('#signature', opts.signature ?? faker.person.fullName());
  }

  async submitForm() {
    await expect(this.page.locator('button[type="submit"]')).toBeEnabled();
    await this.page.click('button[type="submit"]');
  }

  async validateSuccess() {
    await expect(this.page.locator('button[type="submit"]')).toBeDisabled();
  }
  
  async expectFirstNameValidationError() {
    await expect(this.page.locator('button[type="submit"]')).toBeDisabled();
  }

  async expectAgreementValidationError() {
    await expect(this.page.locator('button[type="submit"]')).toBeDisabled();
  }
}
