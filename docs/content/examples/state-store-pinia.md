---
title: Queries with Pinia
description: Using queries in a Pinia state store
order: 3
---

# Queries in a state store

There are multiple ways you can query in a state store. For example, [Pinia](https://pinia.vuejs.org/) allows you to define stores as a smaller setup functions. This allows you to use `useQuery` or `useMutation` features directly in your store as state or actions.

The following example showcases a store created using `useQuery` where it fetches the data from the API and shows a loading state as well.

<iframe
  src="https://stackblitz.com/edit/vitejs-vite-ipujmr?embed=1&file=src/components/Pets.vue&view=preview"
  style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  loading="lazy"
  class="mt-8"
></iframe>
