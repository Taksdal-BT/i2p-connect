import { OnboardingManager, type OnboardingFsAdapter } from '../../src/status/onboarding';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
  }
}

class InMemoryFsAdapter implements OnboardingFsAdapter {
  private readonly files = new Map<string, string>();

  readFileSync(path: string, encoding: 'utf-8'): string {
    void encoding;

    const value = this.files.get(path);
    if (value === undefined) {
      const missing = new Error('File not found.') as Error & { code: string };
      missing.code = 'ENOENT';
      throw missing;
    }

    return value;
  }

  writeFileSync(path: string, data: string, encoding: 'utf-8'): void {
    void encoding;
    this.files.set(path, data);
  }

  setFile(path: string, data: string): void {
    this.files.set(path, data);
  }

  getFile(path: string): string | undefined {
    return this.files.get(path);
  }
}

const persistencePath = 'onboarding-state.json';

const defaultFs = new InMemoryFsAdapter();
const defaultManager = new OnboardingManager(defaultFs, persistencePath);
const defaultState = defaultManager.getState();

assertEqual(defaultState.isComplete, false, 'default onboarding state should be incomplete');
assertEqual(defaultState.currentStep, 0, 'default onboarding step should start at 0');
assertEqual(defaultState.hasRouter, false, 'default onboarding should start without router readiness');
assertEqual(defaultState.hasIdentity, false, 'default onboarding should start without identity');

const progressingFs = new InMemoryFsAdapter();
const progressingManager = new OnboardingManager(progressingFs, persistencePath);

const afterRouter = progressingManager.checkRouter();
assertEqual(afterRouter.currentStep, 1, 'checkRouter should advance to step 1');
assertEqual(afterRouter.hasRouter, true, 'checkRouter should set hasRouter');

const afterIdentity = progressingManager.generateIdentity();
assertEqual(afterIdentity.currentStep, 2, 'generateIdentity should advance to step 2');
assertEqual(afterIdentity.hasIdentity, true, 'generateIdentity should set hasIdentity');
assertEqual(afterIdentity.hasRouter, true, 'router readiness should be retained after identity step');

const completionFs = new InMemoryFsAdapter();
const completionManager = new OnboardingManager(completionFs, persistencePath);
completionManager.checkRouter();
completionManager.generateIdentity();
const completedState = completionManager.completeOnboarding();

assertEqual(completedState.isComplete, true, 'completeOnboarding should mark onboarding as complete');
assertEqual(completedState.currentStep, 3, 'completeOnboarding should set final onboarding step');
assertEqual(completedState.hasRouter, true, 'completeOnboarding should keep router readiness true');
assertEqual(completedState.hasIdentity, true, 'completeOnboarding should keep identity readiness true');

const persistedPayload = completionFs.getFile(persistencePath);
assert(persistedPayload !== undefined, 'completeOnboarding should persist onboarding payload');
assert(
  (persistedPayload ?? '').includes('"isComplete": true'),
  'persisted onboarding payload should mark isComplete true'
);

const loadedFs = new InMemoryFsAdapter();
loadedFs.setFile(persistencePath, JSON.stringify({ isComplete: true }));
const loadedManager = new OnboardingManager(loadedFs, persistencePath);
const loadedState = loadedManager.getState();

assertEqual(loadedState.isComplete, true, 'manager should load completed state from disk');
assertEqual(loadedState.currentStep, 3, 'loaded completed state should initialize to final step');
assertEqual(loadedState.hasRouter, true, 'loaded completed state should initialize hasRouter true');
assertEqual(loadedState.hasIdentity, true, 'loaded completed state should initialize hasIdentity true');
