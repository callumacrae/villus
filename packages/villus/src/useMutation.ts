import { ref, Ref, unref } from 'vue';
import { MaybeRef, OperationResult, QueryExecutionContext, QueryVariables } from './types';
import { CombinedError } from './utils';
import { Operation } from '../../shared/src';
import { Client, resolveClient } from './client';

interface MutationExecutionOptions {
  context: MaybeRef<QueryExecutionContext>;
  client?: Client;
}

export function useMutation<TData = any, TVars = QueryVariables>(
  query: Operation<TData, TVars>['query'],
  opts?: Partial<MutationExecutionOptions>
) {
  const client = opts?.client ?? resolveClient();

  const data: Ref<TData | null> = ref(null);
  const isFetching = ref(false);
  const isDone = ref(false);
  const error: Ref<CombinedError | null> = ref(null);

  // This is to prevent state mutation for racing requests, basically favoring the very last one
  let lastPendingOperation: Promise<OperationResult<TData>> | undefined;
  async function execute(variables?: TVars) {
    isFetching.value = true;
    const vars = variables || {};
    const pendingExecution = client.executeMutation<TData, TVars>(
      {
        query,
        variables: vars as TVars, // FIXME: fix this casting
      },
      unref(opts?.context)
    );

    lastPendingOperation = pendingExecution;
    const res = await pendingExecution;
    // Avoid state mutation if the pendingExecution isn't the last pending operation
    if (pendingExecution !== lastPendingOperation) {
      // we still return this result to preserve the integrity of "execute" calls
      return { data: res.data as TData, error: res.error };
    }

    data.value = res.data;
    error.value = res.error;
    isDone.value = true;
    isFetching.value = false;
    lastPendingOperation = undefined;

    return { data: data.value, error: error.value };
  }

  return { data, isFetching, isDone, error, execute };
}
