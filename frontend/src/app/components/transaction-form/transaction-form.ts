import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TransactionService } from '../../services/transaction';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css']
})
export class TransactionForm implements OnInit {
  private transactionService = inject(TransactionService);
  private router = inject(Router);

  accounts: { id: string; name: string }[] = [];
  categories: { id: string; name: string }[] = [];

  isLoading = false;
  errorMessage = '';

  transactionForm = new FormGroup({
    type: new FormControl<'INCOME' | 'EXPENSE' | 'TRANSFER'>('EXPENSE', [Validators.required]),
    amount: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    date: new FormControl<string>(new Date().toISOString().split('T')[0], [Validators.required]),
    account_id: new FormControl<string>('', [Validators.required]),

    // Campos condicionais
    category_id: new FormControl<string>('', [Validators.required]),
    transfer_account_id: new FormControl<string>(''),

    description: new FormControl<string>(''),
    status: new FormControl<'PENDING' | 'COMPLETED'>('COMPLETED')
  });

  ngOnInit() {
    this.loadFormData();
    // Escuta mudanças no 'type' para aplicar as regras de negócio do frontend
    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      const categoryCtrl = this.transactionForm.get('category_id');
      const transferCtrl = this.transactionForm.get('transfer_account_id');

      if (type === 'TRANSFER') {
        categoryCtrl?.clearValidators();
        categoryCtrl?.setValue('');
        transferCtrl?.setValidators([Validators.required]);
      } else {
        categoryCtrl?.setValidators([Validators.required]);
        transferCtrl?.clearValidators();
        transferCtrl?.setValue('');
      }

      categoryCtrl?.updateValueAndValidity();
      transferCtrl?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const formData = this.transactionForm.getRawValue();

    this.transactionService.createTransaction(formData).subscribe({
      next: () => {
        this.router.navigate(['/transactions']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error saving transaction.';
      }
    });
  }

  goBack() {
    // Volta para a lista de transações
    this.router.navigate(['/transactions']);
  }

  loadFormData() {
    // TODO: Chamar os serviços reais para preencher as listagens de contas e categorias
    // this.accountService.getAccounts().subscribe(data => this.accounts = data);
    // this.categoryService.getCategories().subscribe(data => this.categories = data);
  }
}
