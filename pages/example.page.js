class ExamplePage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/');
  }

  async getTitle() {
    return this.page.title();
  }
}

module.exports = { ExamplePage };

