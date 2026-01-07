// Bubble Sort Algorithm

export function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// Merge Sort Algorithm

export function BubbleSortString(arr: string[]): void {
  // Base case: If the array has only one element, return since it's already sorted.
  if (arr.length <= 1) return;

  const mid = Math.floor(arr.length / 2);
  const leftHalf = arr.slice(0, mid);
  const rightHalf = arr.slice(mid);

  // Recursively sort each half of the array.
  BubbleSortString(leftHalf);
  BubbleSortString(rightHalf);

  // Merge and sort both halves in-place.
  let i = 0; // Left Half Index
  let j = 0; // Right Half Index
  let k = 0; // Current Array Index

  while (i < leftHalf.length && j < rightHalf.length) {
    if (leftHalf[i] <= rightHalf[j]) {
      arr[k] = leftHalf[i];
      i++;
    } else {
      arr[k] = rightHalf[j];
      j++;
    }
    k++; // Increment the current array index.
  }

  // If there are remaining elements in either half of the array, append them to the result.
  while (i < leftHalf.length) {
    arr[k] = leftHalf[i];
    i++;
    k++;
  }

  while (j < rightHalf.length) {
    arr[k] = rightHalf[j];
    j++;
    k++;
  }
}

// Selection Sort Algorithm

export function selectionSort(arr: number[]): number[] {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap the found minimum element with the current element
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }

  return arr;
}

// Quick Sort Algorithm

export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left: number[] = [];
  const middle: number[] = [];
  const right: number[] = [];

  for (const x of arr) {
    if (x < pivot) {
      left.push(x);
    } else if (x === pivot) {
      middle.push(x);
    } else {
      right.push(x);
    }
  }

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Merge Sort Algorithm

// Merge Sort Algorithm (without inversion count)
export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const middle = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, middle);
  const rightArr = arr.slice(middle);

  // Recursively sort the two halves
  const sortedLeft = mergeSort(leftArr);
  const sortedRight = mergeSort(rightArr);

  return mergeArrays(sortedLeft, sortedRight);
}

export function mergeArrays(left: number[], right: number[]): number[] {
  // This will store the result of our merge
  const mergedArray: number[] = [];

  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      mergedArray.push(left.shift() as number);
    } else {
      mergedArray.push(right.shift() as number);
    }
  }

  // In case there are elements left in either the left or right array, we should add them to our result
  while (left.length) mergedArray.push(left.shift() as number);
  while (right.length) mergedArray.push(right.shift() as number);

  return mergedArray;
}

// Insertion Sort
export function insertionSort(arr: number[]): void {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr.splice(j + 1, 1, key);
  }
}
