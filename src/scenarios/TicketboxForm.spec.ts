import { test } from '@playwright/test';
import { ai } from '@zerostep/playwright';
import TicketboxFormPage from '../support/pages/TicketboxFormPage';


test.describe('TicketboxFormPage - Custom Scenarios', () => {
  test('1. Sucesso - Compra VIP', async ({ page }) => {
    const ticketboxPage = new TicketboxFormPage(page);
    await ticketboxPage.goto();
    await ticketboxPage.fillFormWithValidData({ ticketType: 'VIP' });
    await ticketboxPage.submitForm();
    await ticketboxPage.validateSuccess();
  });

  test('2. Erro - Nome em Branco', async ({ page }) => {
    const ticketboxPage = new TicketboxFormPage(page);
    await ticketboxPage.goto();
    await ticketboxPage.fillFormWithValidData({ firstName: '' });
    await ticketboxPage.expectFirstNameValidationError();
  });

  test('3. Erro - Não Aceitou o Acordo', async ({ page }) => {
    const ticketboxPage = new TicketboxFormPage(page);
    await ticketboxPage.goto();
    await ticketboxPage.fillFormWithValidData({ agree: false });
    await ticketboxPage.expectAgreementValidationError();
  });

  test('4. Sucesso - Apenas "Publication" como Origem', async ({ page }) => {
    const ticketboxPage = new TicketboxFormPage(page);
    await ticketboxPage.goto();
    await ticketboxPage.fillFormWithValidData({ hearFrom: ['#publication'] });
    await ticketboxPage.submitForm();
    await ticketboxPage.validateSuccess();
  });

  test('5. Ticketbox - Compra bem-sucedida com IA', async ({ page }) => {
    const ticketboxPage = new TicketboxFormPage(page);
    await ticketboxPage.goto();
  
    const aiArgs = { page, test };
  
    await ai('Preencher o primeiro nome com "Maria"', aiArgs);
    await ai('Preencher o sobrenome com "Silva"', aiArgs);
    await ai('Preencher o e-mail com "maria.silva@email.com"', aiArgs);
    await ai('Selecionar dois ingressos', aiArgs);
    await ai('Selecionar General Admission', aiArgs);
    await ai('Marcar que ouviu pelo Friend e Social Media', aiArgs);
    await ai('Adicionar pedido especial: "Acesso para cadeira de rodas"', aiArgs);
    await ai('Marcar que aceita o acordo', aiArgs);
    await ai('Preencher assinatura com "Maria Silva"', aiArgs);
    await ai('Clicar em Confirm Tickets', aiArgs);
    await ai('Verificar se o botão de confirmação está desabilitado após o envio', aiArgs);
  });
});
