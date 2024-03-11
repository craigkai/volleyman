<script lang="ts">
	import * as Button from '$components/ui/button';

	type $$Props = Button.Props;
</script>

<Button.Root type="submit" {...$$restProps}>
	<slot />
</Button.Root>
