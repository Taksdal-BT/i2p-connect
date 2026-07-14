export interface OnboardingState {
  isComplete: boolean;
  currentStep: number;
  hasRouter: boolean;
  hasIdentity: boolean;
}

interface OnboardingPersistenceShape {
  isComplete: boolean;
}

export interface OnboardingFsAdapter {
  readFileSync(path: string, encoding: 'utf-8'): string;
  writeFileSync(path: string, data: string, encoding: 'utf-8'): void;
}

const FINAL_ONBOARDING_STEP = 3;

export class OnboardingManager {
  private state: OnboardingState;

  constructor(
    private readonly fsAdapter: OnboardingFsAdapter,
    private readonly storagePath: string
  ) {
    this.state = this.loadInitialState();
  }

  getState(): OnboardingState {
    return { ...this.state };
  }

  checkRouter(): OnboardingState {
    if (this.state.isComplete) {
      return this.getState();
    }

    this.state = {
      ...this.state,
      hasRouter: true,
      currentStep: Math.max(this.state.currentStep, 1)
    };

    return this.getState();
  }

  generateIdentity(): OnboardingState {
    if (this.state.isComplete) {
      return this.getState();
    }

    this.state = {
      ...this.state,
      hasIdentity: true,
      currentStep: Math.max(this.state.currentStep, 2)
    };

    return this.getState();
  }

  completeOnboarding(): OnboardingState {
    this.state = {
      isComplete: true,
      currentStep: FINAL_ONBOARDING_STEP,
      hasRouter: true,
      hasIdentity: true
    };

    this.persistCompletionState();
    return this.getState();
  }

  private loadInitialState(): OnboardingState {
    let raw = '';

    try {
      raw = this.fsAdapter.readFileSync(this.storagePath, 'utf-8');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
        return {
          isComplete: false,
          currentStep: 0,
          hasRouter: false,
          hasIdentity: false
        };
      }

      throw new Error('Unable to read onboarding state from local storage.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Unable to parse onboarding state from local storage.');
    }

    if (typeof parsed !== 'object' || parsed === null || !('isComplete' in parsed)) {
      throw new Error('Onboarding state payload is invalid.');
    }

    const payload = parsed as OnboardingPersistenceShape;

    if (payload.isComplete === true) {
      return {
        isComplete: true,
        currentStep: FINAL_ONBOARDING_STEP,
        hasRouter: true,
        hasIdentity: true
      };
    }

    return {
      isComplete: false,
      currentStep: 0,
      hasRouter: false,
      hasIdentity: false
    };
  }

  private persistCompletionState(): void {
    const payload: OnboardingPersistenceShape = {
      isComplete: this.state.isComplete
    };

    this.fsAdapter.writeFileSync(this.storagePath, JSON.stringify(payload, null, 2), 'utf-8');
  }
}
