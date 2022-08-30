import {Component, ElementRef, OnInit, ViewChild} from '@angular/core'

import Quill from 'quill'

import ImageResize from 'quill-image-resize-module'
import jsPDF from 'jspdf'
import {File} from './Core/Model/file'
import {FileService} from './Core/Service/file.service'
import {error} from '@angular/compiler-cli/src/transformers/util'
import {HttpErrorResponse} from '@angular/common/http'
Quill.register('modules/imageResize', ImageResize)

@Component({
  selector: 'app-formula',
  styleUrls: ['formula.component.css'],
  templateUrl: './formula.component.html'
})
export class FormulaComponent implements OnInit{
  @ViewChild('cont',{static: false}) el!:ElementRef
  editorcontent: string
  name = ''
  modules = {}
  content = ''
  matContent = this.content
  file: File
  files : File[]
  constructor( private fileservice : FileService) {
    this.modules = {
      formula: true,
      imageResize: {},
      syntax: true,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean'],                                         // remove formatting button

        ['link', 'image', 'video']                         // link and image, video

      ]
    }
  }

  ngOnInit(): void {
    this.file = new File()
    this.getfiles()
    }

  addBindingCreated(quill: Quill) {
    quill.keyboard.addBinding({
      key: 'b'
    }, (range, context) => {
      // tslint:disable-next-line:no-console
      console.log('KEYBINDING B', range, context)
    })

    quill.keyboard.addBinding({
      key: 'B',
      shiftKey: true
    } as any, (range, context) => {
      // tslint:disable-next-line:no-console
      console.log('KEYBINDING SHIFT + B', range, context)
    })
  }
  onSubmit() {
    this.editorcontent = this.content
  }
  createPDF()
  { if (this.name !== ''){
    const pdf = new jsPDF('p','pt','a4')
    // let pageHeight = pdf.internal.pageSize.height;
    // let y = 500
    //  if (y>=pageHeight){
    //   pdf.addPage();
    //   y=0;
    // }
    pdf.html(this.el.nativeElement,{
      // tslint:disable-next-line:no-shadowed-variable
      callback: (pdf)=>{pdf.save(this.name+'.pdf')}
    }) } else {
    alert('please type in a name for the file')
  }

  }

  savePDF() {
    if (this.name !== ''){
    this.file.name = this.name
    this.file.text = this.content
    this.fileservice.createFile(this.file).subscribe()
    alert('file saved')}
    else {
        alert('please type in a name for the file')
      }
  }

  loadPDF(file: File) {
    this.content = file.text
  }
  getfiles(): void {
    this.fileservice.getFiles().subscribe(
        (response: File[]) => {
          this.files = response
        },
        // tslint:disable-next-line:no-shadowed-variable
        (error: HttpErrorResponse) => {
          alert(error.message)
        }
    )
  }
}
