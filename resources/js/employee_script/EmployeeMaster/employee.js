import Swal from 'sweetalert2';

export async function loadEmployee(ctx, employeeId) {
    if (!employeeId) {
        return;
    }

    try {
        const response = await fetch(
            ctx.api.show(employeeId),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With':
                        'XMLHttpRequest'
                },
                credentials: 'same-origin'
            }
        );

        const result =
            await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ||
                'Unable to load employee.'
            );
        }

        const employee =
            result.data ||
            result.employee ||
            result;

        ctx.populateForm(employee);
        ctx.setMode('view');

        if (
            ctx.state.currentSearchIndex < 0
        ) {
            const foundIndex =
                ctx.state.searchItems.findIndex(
                    item =>
                        String(item.emp_id) ===
                        String(employee.emp_id)
                );

            if (foundIndex >= 0) {
                ctx.state.currentSearchIndex =
                    foundIndex;
            }
        }

        ctx.updateCounter();
    } catch (error) {
        console.error(
            'Employee load error:',
            error
        );

        await Swal.fire({
            icon: 'error',
            title: 'Unable to Load Employee',
            text:
                error.message ||
                'The employee information could not be loaded.'
        });
    }
}

export async function navigateEmployee(
    ctx,
    direction
) {
    if (
        ctx.state.mode !== 'view' ||
        ctx.state.searchItems.length === 0 ||
        ctx.state.currentSearchIndex < 0
    ) {
        return;
    }

    let nextIndex =
        ctx.state.currentSearchIndex;

    if (direction === 'next') {
        if (
            ctx.state.currentSearchIndex >=
            ctx.state.searchItems.length - 1
        ) {
            return;
        }

        nextIndex++;
    } else {
        if (
            ctx.state.currentSearchIndex <= 0
        ) {
            return;
        }

        nextIndex--;
    }

    const employee =
        ctx.state.searchItems[nextIndex];

    if (!employee?.emp_id) {
        return;
    }

    ctx.state.currentSearchIndex =
        nextIndex;

    await ctx.loadEmployee(
        employee.emp_id
    );

    ctx.updateCounter();
}