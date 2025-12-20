import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmDatePickerModule } from '@spartan-ng/helm/date-picker';
import { HlmInputModule } from '@spartan-ng/helm/input';
import { HlmLabelModule } from '@spartan-ng/helm/label';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { Priority, Status, TaskData } from '../../services/task-api';

@Component({
    selector: 'app-task-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        HlmButtonModule,
        HlmInputModule,
        HlmLabelModule,
        BrnSelectModule,
        HlmSelectModule,
        HlmDatePickerModule,
    ],
    templateUrl: './task-form.html',
})
export class TaskFormComponent implements OnChanges {
    private fb = inject(FormBuilder);

    @Input() task: TaskData | null = null;
    @Input() isLoading = false;
    @Input() isUpdateMode = false;
    @Input() serverError: string | null = null;
    @Output() save = new EventEmitter<any>();

    form = this.fb.group({
        title: ['', Validators.required],
        description: [''],
        priority: ['medium' as Priority, Validators.required],
        status: ['pending' as Status],
        dueDate: [new Date(), Validators.required],
    });

    priorities: { label: string; value: Priority }[] = [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
    ];

    statuses: { label: string; value: Status }[] = [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['task'] && this.task) {
            this.form.patchValue({
                title: this.task.title,
                description: this.task.description,
                priority: this.task.priority,
                status: this.task.isCompleted ? 'completed' : 'pending',
                dueDate: new Date(this.task.dueDate),
            });
        }
    }

    onSubmit() {
        if (this.form.valid) {
            this.save.emit(this.form.value);
        } else {
            this.form.markAllAsTouched();
        }
    }

}
