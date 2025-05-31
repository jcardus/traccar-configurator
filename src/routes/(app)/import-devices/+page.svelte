<script>
    import {Button, Modal, Spinner, Textarea} from "flowbite-svelte";
    let value
</script>
<div class="p-4">
Paste devices here:
<Textarea bind:value={value}>
</Textarea>
<Button onclick={async () => {
    try {
    let i=1
    for(const l of value.split('\n')) {
        await fetch('/api/devices', {
            method: 'post',
            body: JSON.stringify({uniqueId: l, name: l}),
            headers: {'content-type': 'application/json'}
        })
        i++
    }
    alert(i + ' devices inserted')
    } catch (e) {
        alert(e.message)
    }
}}>Doit</Button>
</div>
