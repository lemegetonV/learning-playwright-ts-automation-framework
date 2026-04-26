import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

export default class ConsoleSummaryReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private interrupted = 0;
  private timedOut = 0;

  onBegin(_config: FullConfig, suite: Suite): void {
    console.log(`[summary] starting ${suite.allTests().length} tests`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.trackStatus(result.status);
    console.log(`[summary] ${result.status.toUpperCase()} ${test.title} (${result.duration}ms)`);
  }

  onEnd(result: FullResult): void {
    console.log(
      `[summary] finished ${result.status}: passed=${this.passed}, failed=${this.failed}, skipped=${this.skipped}, timedOut=${this.timedOut}, interrupted=${this.interrupted}`,
    );
  }

  private trackStatus(status: TestResult['status']): void {
    if (status === 'passed') {
      this.passed += 1;
      return;
    }

    if (status === 'failed') {
      this.failed += 1;
      return;
    }

    if (status === 'skipped') {
      this.skipped += 1;
      return;
    }

    if (status === 'timedOut') {
      this.timedOut += 1;
      return;
    }

    if (status === 'interrupted') {
      this.interrupted += 1;
    }
  }
}
